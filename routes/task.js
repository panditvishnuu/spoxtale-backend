const express = require("express");
const roleMiddleware = require("../middleware/roleMiddleware");
const Task = require("../models/Task");
const User = require("../models/User");
const authenticateUser = require("../middleware/auth");
const router = express.Router();


router.post(
  "/",
  authenticateUser,
  roleMiddleware(["Administrator", "Manager"]),
  async (req, res) => {
    const {
      title,
      description,
      assignedTo,
      status = "Pending",
      priority,
      startDate,
      endDate,
    } = req.body;

    try {
      if (!title || !description) {
        return res
          .status(400)
          .json({ message: "Title and description are required" });
      }

      const task = new Task({
        title,
        description,
        assignedTo: assignedTo || null,
        status,
        priority,
        startDate,
        endDate,
      });

      await task.save();
      res.status(201).json({ message: "Task created successfully", task });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to create task", error: err.message });
    }
  }
);

/**
 * Update a task (Admin/Manager only)
 */
router.put(
  "/:id",
  authenticateUser,
  roleMiddleware(["Administrator", "Manager"]),
  async (req, res) => {
    const {
      title,
      description,
      assignedTo,
      status,
      priority,
      startDate,
      endDate,
    } = req.body;

    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.assignedTo = assignedTo || task.assignedTo;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.startDate = startDate || task.startDate;
      task.endDate = endDate || task.endDate;

      await task.save();
      res.json({ message: "Task updated successfully", task });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to update task", error: err.message });
    }
  }
);

router.delete(
  "/:id",
  authenticateUser,
  roleMiddleware(["Administrator", "Manager"]),
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: "Task deleted successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to delete task", error: err.message });
    }
  }
);

router.post(
  "/assign",
  authenticateUser,
  roleMiddleware(["Manager"]),
  async (req, res) => {
    const { taskId, employeeId } = req.body;

    try {
      const task = await Task.findById(taskId);
      const employee = await User.findById(employeeId);

      if (!task || !employee) {
        return res.status(404).json({ message: "Task or employee not found" });
      }

      task.assignedTo = employeeId;
      await task.save();
      res.json({ message: "Task assigned successfully", task });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to assign task", error: err.message });
    }
  }
);

router.put(
  "/:id/status",
  authenticateUser,
  roleMiddleware(["Employee"]),
  async (req, res) => {
    const { status } = req.body;

    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      task.status = status;
      await task.save();
      res.json({ message: "Task status updated successfully", task });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to update task status", error: err.message });
    }
  }
);

router.get(
  "/",
  authenticateUser,
  roleMiddleware(["Administrator", "Manager"]),
  async (req, res) => {
    try {
      const tasks = await Task.find().populate("assignedTo", "username");
      res.json(tasks);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch tasks", error: err.message });
    }
  }
);

router.get(
  "/my-tasks",
  authenticateUser,
  roleMiddleware(["Employee"]),
  async (req, res) => {
    try {
      const tasks = await Task.find({ assignedTo: req.user.id });

      if (!tasks.length) {
        return res.status(404).json({ message: "No tasks found" });
      }

      res.send(tasks);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch tasks", error: err.message });
    }
  }
);


module.exports = router;
