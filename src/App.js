import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/api';
import { Container, Header, Button, Form, Card, Icon } from 'semantic-ui-react';
import { listTasks } from './graphql/queries';
import { createTask, deleteTask, updateTask } from './graphql/mutations';
import './App.css';

const client = generateClient();

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    status: 'TODO', 
    priority: 'MEDIUM' 
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const taskData = await client.graphql({ query: listTasks });
      const tasks = taskData.data.listTasks.items;
      setTasks(tasks);
    } catch (err) {
      console.log('error fetching tasks', err);
    }
  }

  async function addTask() {
    try {
      if (!formData.title) return;
      await client.graphql({
        query: createTask,
        variables: { input: formData }
      });
      setFormData({ title: '', description: '', status: 'TODO', priority: 'MEDIUM' });
      fetchTasks();
    } catch (err) {
      console.log('error creating task:', err);
    }
  }

  async function removeTask(id) {
    try {
      await client.graphql({
        query: deleteTask,
        variables: { input: { id } }
      });
      fetchTasks();
    } catch (err) {
      console.log('error deleting task:', err);
    }
  }

  async function toggleTaskStatus(task) {
    try {
      const newStatus = task.status === 'TODO' ? 'COMPLETED' : 'TODO';
      await client.graphql({
        query: updateTask,
        variables: {
          input: {
            id: task.id,
            status: newStatus
          }
        }
      });
      fetchTasks();
    } catch (err) {
      console.log('error updating task:', err);
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Container style={{ marginTop: '40px' }}>
          <Header as='h1' textAlign='center'>
            <Icon name='tasks' />
            AWS Amplify Task Manager
          </Header>
          
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <span style={{ marginRight: '10px' }}>Hello, {user.username}</span>
            <Button onClick={signOut} negative>Sign Out</Button>
          </div>

          <Form>
            <Form.Group widths='equal'>
              <Form.Input
                fluid
                placeholder='Task title'
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              <Form.Select
                fluid
                placeholder='Priority'
                value={formData.priority}
                onChange={(e, { value }) => setFormData({ ...formData, priority: value })}
                options={[
                  { key: 'low', text: 'Low', value: 'LOW' },
                  { key: 'medium', text: 'Medium', value: 'MEDIUM' },
                  { key: 'high', text: 'High', value: 'HIGH' },
                ]}
              />
            </Form.Group>
            <Form.TextArea
              placeholder='Description (optional)'
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            <Button primary onClick={addTask}>Add Task</Button>
          </Form>

          <Card.Group style={{ marginTop: '30px' }}>
            {tasks.map(task => (
              <Card key={task.id} fluid>
                <Card.Content>
                  <Card.Header>
                    {task.title}
                    <Icon
                      name='trash'
                      style={{ float: 'right', cursor: 'pointer' }}
                      onClick={() => removeTask(task.id)}
                      color='red'
                    />
                  </Card.Header>
                  <Card.Meta>{task.priority} Priority</Card.Meta>
                  <Card.Description>{task.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    size='small'
                    color={task.status === 'COMPLETED' ? 'green' : 'grey'}
                    onClick={() => toggleTaskStatus(task)}
                  >
                    {task.status === 'COMPLETED' ? 'Completed' : 'Mark Complete'}
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Container>
      )}
    </Authenticator>
  );
}

export default App;