"use strict";

const { groupCategoriesStorageFactory } = require("../storage");

const defaultRepo = () => {
  return {
    groupCategoriesRepository: groupCategoriesStorageFactory.repository,
  };
};

class GroupCategoriesProvider {
  constructor({ groupCategoriesRepository } = defaultRepo()) {
    this.groupCategoriesRepository = groupCategoriesRepository;
  }

  async createGroupCategory(userId, incomingPayload) {
    try {
      // Step 1: Check if a category with the same name exists
      const existingCategory = await this.groupCategoriesRepository.findGroupCategories(
        { name: incomingPayload.name },
        { _id: 1 }
      );
  
      if (existingCategory.length > 0) {
        throw new Error("A category with this name already exists");
      }
  
      // Step 2: Create the new category
      const payload = {
        name: incomingPayload.name,
        createdBy: userId,
        isActive: true,
      };
  
      return await this.groupCategoriesRepository.createGroupCategory(payload);
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async findGroupCategories(search) {
    try {
      const conditions = {
        isActive: true,
        ...(search ? { name: { $regex: search, $options: "i" } } : {})
      }
      return await this.groupCategoriesRepository.findGroupCategories(
        conditions,
        { _id: 1, name: 1}
      );
    } catch (error) {
      console.error("Error fetching group categories:", error);
      throw error;
    }
  }

  async deleteGroupCategory(userId, categoryId) {
    try {
      // Step 1: Find the category and validate requester
      const [category] = await this.groupCategoriesRepository.findGroupCategories({_id: categoryId}, { _id: 1, createdBy: 1 });

      if (!category) {
        throw new Error("Category not found");
      }

      // Step 2: Ensure the requester is the creator of the category
      if (category.createdBy !== userId) {
        throw new Error("You are not authorized to delete this category");
      }

      // Step 4: Delete the category
      await this.groupCategoriesRepository.updateGroupCategory(
        { _id: categoryId },
        { $set: { isActive: false } },
        {}
      );

      return "Category deleted successfully";
    } catch (error) {
      console.error("Error deleting the category:", error);
      throw error;
    }
  }

  async updateGroupCategory(userId, categoryId, name) {
    try {
      // Step 1: Find the category and validate requester
      const [category] = await this.groupCategoriesRepository.findGroupCategories(
        { _id: categoryId },
        { _id: 1, createdBy: 1, name: 1 }
      );
  
      if (!category) {
        throw new Error("Category not found");
      }
  
      // Step 2: Ensure the requester is the creator of the category
      if (category.createdBy !== userId) {
        throw new Error("You are not authorized to update this category");
      }
  
      // Step 3: Check if the new name already exists (excluding the current category)
      const existingCategory = await this.groupCategoriesRepository.findGroupCategories(
        { name, _id: { $ne: categoryId } },
        { _id: 1 }
      );
  
      if (existingCategory.length > 0) {
        throw new Error("A category with this name already exists");
      }
  
      // Step 4: Update the category
      await this.groupCategoriesRepository.updateGroupCategory(
        { _id: categoryId },
        { $set: { name } },
        {}
      );
  
      return "Category updated successfully";
    } catch (error) {
      console.error("Error updating the category:", error);
      throw error;
    }
  }
}

module.exports = {
  GroupCategoriesProvider,
};
