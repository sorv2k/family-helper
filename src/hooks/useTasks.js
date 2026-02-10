import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listTasks } from '../graphql/queries';
import { createTask, deleteTask, updateTask } from '../graphql/mutations';

const client = generateClient();

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const taskData = await client.graphql({ query: listTasks });
      setTasks(taskData.data.listTasks.items);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(taskData) {
    try {
      await client.graphql({
        query: createTask,
        variables: { input: taskData }
      });
      await fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  }

  async function removeTask(id) {
    try {
      await client.graphql({
        query: deleteTask,
        variables: { input: { id } }
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  }

  async function toggleStatus(task) {
    try {
      const newStatus = task.status === 'TODO' ? 'COMPLETED' : 'TODO';
      await client.graphql({
        query: updateTask,
        variables: { input: { id: task.id, status: newStatus } }
      });
      await fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  }

  return { tasks, loading, addTask, removeTask, toggleStatus, refetch: fetchTasks };
}