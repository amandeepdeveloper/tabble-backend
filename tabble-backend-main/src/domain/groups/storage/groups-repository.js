"use strict";

const { Groups } = require(`${modelsPath}`);

const defaultModel = () => {
  return Groups;
};

class GroupsRepository {
  constructor(Groups = defaultModel()) {
    this.Groups = Groups;
  }

  async createGroup(payload) {
    return await this.Groups.addGroup(payload);
  }
  
  async findAggregatedGroups(userId, myGroups = false, { latitude, longitude, name, categoryId }) {
    const radiusInMeters = 25 * 1609.34; // Convert 25 miles to meters
    const pipeline = [];
  
    // Step 1: Filter groups based on location only if latitude and longitude are provided
    if (latitude !== undefined && longitude !== undefined) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)]
          },
          distanceField: "distance",
          maxDistance: radiusInMeters, // ✅ Moved inside $geoNear
          spherical: true
        }
      });
    }
  
    // Step 2: General match filters
    pipeline.push({
      $match: {
        isActive: true, // Only fetch active groups
        ...(name ? { name: { $regex: name, $options: "i" } } : {}), // Case-insensitive name search
        ...(categoryId ? { categoryId: Number(categoryId) } : {}), // Match categoryId if provided
        ...(myGroups ? { createdBy: Number(userId) } : {}) // Fetch only groups created by this user if given
      }
    });
  
    // Step 3: Ensure the user is NOT in blockedMembers
    pipeline.push({
      $match: {
        blockedMembers: { $ne: Number(userId) } // Exclude groups where userId is in blockedMembers
      }
    });
  
    // Step 4: Populate category details
    pipeline.push(
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true // If category is missing, keep null instead of dropping the document
        }
      }
    );
  
    // Step 5: Populate members
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "blockedMembers",
          foreignField: "_id",
          as: "blockedMembers"
        }
      }
    );
  
    // Step 6: Project only required fields
    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        categoryId: 1,
        groupPicUrl: 1,
        "categoryDetails._id": 1,
        "categoryDetails.name": 1,
        "categoryDetails.description": 1,
        location: 1,
        createdBy: 1,
        members: {
          _id: 1,
          name: 1,
          countryCode: 1,
          mobileNumber: 1,
          profilePicUrl: 1,
          bio: 1
        },
        blockedMembers: {
          _id: 1,
          name: 1,
          countryCode: 1,
          mobileNumber: 1,
          profilePicUrl: 1,
          bio: 1
        }
      }
    });
  
    const groups = await this.Groups.aggregate(pipeline);
    return groups;
  }

  async updateGroup(conditions, updatePayload, options) {
    return await this.Groups.updateGroup(conditions, updatePayload, options);
  }

  async findGroupById(groupId) {
    const conditions = { _id: groupId };
    const selectParams = {
      _id: 1,
      createdBy: 1,
      blockedMembers: 1
    };
    const [group] = await this.Groups.findGroups(conditions, selectParams);
    return group;
  }
}

module.exports = {
  GroupsRepository,
};
