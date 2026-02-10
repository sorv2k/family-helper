import React, { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Container, Header, Button, Form, Card, Icon, Loader } from 'semantic-ui-react';
import { useTasks } from './hooks/useTasks';
import './App.css';

function App() {
  const { tasks, loading, addTask, removeTask, toggleStatus } = useTasks();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    status: 'TODO', 
    priority: 'MEDIUM' 
  });

  async function handleAddTask() {
    if (!formData.title) return;
    await addTask(formData);
    setFormData({ title: '', description: '', status: 'TODO', priority: 'MEDIUM' });
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
            <Button primary onClick={handleAddTask}>Add Task</Button>
          </Form>

          {loading ? (
            <Loader active inline='centered' style={{ marginTop: '30px' }}>Loading tasks...</Loader>
          ) : (
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
                      onClick={() => toggleStatus(task)}
                    >
                      {task.status === 'COMPLETED' ? 'Completed' : 'Mark Complete'}
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          )}
        </Container>
      )}
    </Authenticator>
  );
}

export default App;