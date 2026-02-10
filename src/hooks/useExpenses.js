import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listExpenses } from '../graphql/queries';
import { createExpense, deleteExpense, updateExpense } from '../graphql/mutations';

const client = generateClient();

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      setLoading(true);
      const expenseData = await client.graphql({ query: listExpenses });
      setExpenses(expenseData.data.listExpenses.items);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addExpense(expenseData) {
    try {
      await client.graphql({
        query: createExpense,
        variables: { input: expenseData }
      });
      await fetchExpenses();
    } catch (err) {
      console.error('Error creating expense:', err);
    }
  }

  async function removeExpense(id) {
    try {
      await client.graphql({
        query: deleteExpense,
        variables: { input: { id } }
      });
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  }

  async function toggleStatus(expense) {
    try {
      const newStatus = expense.status === 'PENDING' ? 'PAID' : 'PENDING';
      await client.graphql({
        query: updateExpense,
        variables: { input: { id: expense.id, status: newStatus } }
      });
      await fetchExpenses();
    } catch (err) {
      console.error('Error updating expense:', err);
    }
  }

  function getTotalExpenses() {
    return expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  }

  function getExpensesByCategory(category) {
    return expenses.filter(expense => expense.category === category);
  }

  return { 
    expenses, 
    loading, 
    addExpense, 
    removeExpense, 
    toggleStatus, 
    getTotalExpenses,
    getExpensesByCategory,
    refetch: fetchExpenses 
  };
}