"use strict";

const { groupsStorageFactory, userStorageFactory } = require("../storage");

const defaultRepo = () => {
  return {
    userRepository: userStorageFactory.repository,
    groupsRepository: groupsStorageFactory.repository,
  };
};

class GroupsProvider {
  constructor({ groupsRepository, userRepository } = defaultRepo()) {
    this.groupsRepository = groupsRepository;
    this.userRepository = userRepository;
  }

  async createGroup(userId, incomingPayload) {
    // create new group
    const payload = {
      createdBy: userId,
      name: incomingPayload.name,
      categoryId: incomingPayload.categoryId,
      groupPicUrl: incomingPayload.groupPicUrl,
      city: incomingPayload.city,
      location: {
        type: "Point",
        coordinates: [incomingPayload.longitude, incomingPayload.latitude],
      },
      members: [userId],
      blockedMembers: [],
      isActive: true,
    };
    return await this.groupsRepository.createGroup(payload);
  }

  async findGroups(userId, myGroups, query = {}) {
    try {
      return await this.groupsRepository.findAggregatedGroups(
        userId,
        myGroups,
        query
      );
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  }

  async markUnmarkGroupAsFavourite(userId, groupId, { favourite }) {
    const group = await this.groupsRepository.findGroupById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }
    // mark/unmark group as favourite
    const updateQuery = favourite
      ? { $addToSet: { favouriteGroups: groupId } } // Add groupId if not already present
      : { $pull: { favouriteGroups: groupId } };

    await this.userRepository.updateUser({ _id: userId }, updateQuery, {
      new: true,
    });
    return favourite ? "Group marked as favourite" : "Group removed from favourite";
    
  }

  async removeUserFromGroup(requestUserId, groupId, targetUserId) {
    try {
      // Step 1: Find the group and validate requester
      const group = await this.groupsRepository.findGroupById(groupId);

      if (!group) {
        throw new Error("Group not found");
      }

      // Step 2: Ensure the requester is the creator of the group
      if (group.createdBy !== requestUserId) {
        throw new Error(
          "You are not authorized to remove members from this group"
        );
      }

      // Step 3: Ensure the requester is not trying to remove themselves
      if (requestUserId === targetUserId) {
        throw new Error("You cannot remove yourself from the group");
      }

      // Step 4: Remove the user from the group's members list
      await this.groupsRepository.updateGroup(
        { _id: groupId },
        { $pull: { members: targetUserId } },
        { new: true }
      );

      return "User removed successfully";
    } catch (error) {
      console.error("Error removing user from group:", error);
      throw error;
    }
  }

  async joinInTheGroup(requestUserId, groupId, targetUserId) {
    try {
      // Step 1: Find the group and validate requester
      const group = await this.groupsRepository.findGroupById(groupId);

      if (!group) {
        throw new Error("Group not found");
      }

      // Step 2: Ensure the requester is not blocked from group
      if (group.blockedMembers.includes(requestUserId)) {
        throw new Error("You are blocked from this group");
      }

      // Step 4: Add the user in the group's members list
      await this.groupsRepository.updateGroup(
        { _id: groupId },
        { $addToSet: { members: requestUserId } },
        { new: true }
      );

      return "User joined successfully";
    } catch (error) {
      console.error("Error joining user in the group:", error);
      throw error;
    }
  }

  async blockUnblockUserFromGroup(requestUserId, groupId, targetUserId, block) {
    try {
      // Step 1: Find the group and validate requester
      const group = await this.groupsRepository.findGroupById(groupId);

      if (!group) {
        throw new Error("Group not found");
      }

      // Step 2: Ensure the requester is the creator of the group
      if (group.createdBy !== requestUserId) {
        throw new Error(
          "You are not authorized to block/unblock members from this group"
        );
      }

      // Step 3: Ensure the requester is not trying to remove themselves
      if (requestUserId === targetUserId) {
        throw new Error("You cannot block/unblock yourself from the group");
      }

      const updateQuery = block
        ? {
            $addToSet: { blockedMembers: targetUserId },
            $pull: { members: targetUserId },
          }
        : { $pull: { blockedMembers: targetUserId } };

      // Step 4: Block the user from the group's
      await this.groupsRepository.updateGroup({ _id: groupId }, updateQuery, {
        new: true,
      });

      return `User ${block ? "blocked" : "unblocked"} successfully`;
    } catch (error) {
      console.error("Error blocking user from group:", error);
      throw error;
    }
  }

  async deleteGroup(userId, groupId) {
    try {
      // Step 1: Find the group and validate requester
      const group = await this.groupsRepository.findGroupById(groupId);

      if (!group) {
        throw new Error("Group not found");
      }

      // Step 2: Ensure the requester is the creator of the group
      if (group.createdBy !== userId) {
        throw new Error("You are not authorized to delete this group");
      }

      // Step 4: Delete the group
      await this.groupsRepository.updateGroup(
        { _id: groupId },
        { $set: { isActive: false } },
        {}
      );

      return "Group deleted successfully";
    } catch (error) {
      console.error("Error deleting the group:", error);
      throw error;
    }
  }
}

module.exports = {
  GroupsProvider,
};
