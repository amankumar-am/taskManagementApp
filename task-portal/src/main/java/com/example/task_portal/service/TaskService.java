package com.example.task_portal.service;

import com.example.task_portal.model.Task;
import com.example.task_portal.repository.TaskRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Cacheable(value = "tasks")
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Cacheable(value = "task", key = "#id")
    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    @CacheEvict(value = { "tasks", "task" }, allEntries = true)
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @CacheEvict(value = { "tasks", "task" }, allEntries = true)
    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);
        if (task != null) {
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setStatus(taskDetails.getStatus());
            return taskRepository.save(task);
        }
        return null;
    }

    @CacheEvict(value = { "tasks", "task" }, allEntries = true)
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
