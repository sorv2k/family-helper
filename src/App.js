import React, { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Container, Header, Button, Form, Card, Icon, Loader, Image, Statistic } from 'semantic-ui-react';
import { useExpenses } from './hooks/useExpenses';
import { useImageUpload } from './hooks/useImageUpload';
import './App.css';

function ExpenseCard({ expense, onToggleStatus, onDelete }) {
  const { getImageUrl } = useImageUpload();
  const [imageUrl, setImageUrl] = useState(null);

  React.useEffect(() => {
    if (expense.receiptImageKey) {
      getImageUrl(expense.receiptImageKey).then(setImageUrl);
    }
  }, [expense.receiptImageKey]);

  return (
    <Card fluid>
      {imageUrl && <Image src={imageUrl} wrapped ui={false} />}
      <Card.Content>
        <Card.Header>
          ${expense.amount.toFixed(2)} - {expense.name}
          <Icon
            name='trash'
            style={{ float: 'right', cursor: 'pointer' }}
            onClick={() => onDelete(expense.id)}
            color='red'
          />
        </Card.Header>
        <Card.Meta>{expense.category} • {expense.date}</Card.Meta>
        <Card.Description>{expense.notes}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button
          size='small'
          color={expense.status === 'PAID' ? 'green' : 'orange'}
          onClick={() => onToggleStatus(expense)}
        >
          {expense.status === 'PAID' ? 'Paid' : 'Pending'}
        </Button>
      </Card.Content>
    </Card>
  );
}

function App() {
  const { expenses, loading, addExpense, removeExpense, toggleStatus, getTotalExpenses } = useExpenses();
  const { uploadImage, uploading } = useImageUpload();
  const [formData, setFormData] = useState({ 
    name: '', 
    amount: '',
    category: 'FOOD',
    notes: '', 
    date: new Date().toISOString().split('T')[0],
    status: 'PENDING'
  });
  const [selectedFile, setSelectedFile] = useState(null);

  async function handleAddExpense() {
    if (!formData.name || !formData.amount) return;
    
    let receiptImageKey = null;
    if (selectedFile) {
      receiptImageKey = await uploadImage(selectedFile);
    }
    
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      receiptImageKey
    };
    
    await addExpense(expenseData);
    setFormData({ 
      name: '', 
      amount: '',
      category: 'FOOD',
      notes: '', 
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    });
    setSelectedFile(null);
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <Container style={{ marginTop: '40px' }}>
          <Header as='h1' textAlign='center' color='green'>
            <Icon name='money bill alternate' />
            Expense Tracker
          </Header>
          
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Button onClick={signOut} negative size='small'>Sign Out</Button>
          </div>

          <Statistic.Group widths='two' size='small' style={{ marginBottom: '30px' }}>
            <Statistic color='blue'>
              <Statistic.Value>${getTotalExpenses().toFixed(2)}</Statistic.Value>
              <Statistic.Label>Total Expenses</Statistic.Label>
            </Statistic>
            <Statistic color='teal'>
              <Statistic.Value>{expenses.length}</Statistic.Value>
              <Statistic.Label>Total Entries</Statistic.Label>
            </Statistic>
          </Statistic.Group>

          <Form>
            <Form.Group widths='equal'>
              <Form.Input
                fluid
                label='Expense Name'
                placeholder='e.g., Groceries, Gas'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <Form.Input
                fluid
                label='Amount ($)'
                type='number'
                step='0.01'
                placeholder='0.00'
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group widths='equal'>
              <Form.Select
                fluid
                label='Category'
                value={formData.category}
                onChange={(e, { value }) => setFormData({ ...formData, category: value })}
                options={[
                  { key: 'food', text: '🍔 Food & Dining', value: 'FOOD' },
                  { key: 'transport', text: '🚗 Transportation', value: 'TRANSPORT' },
                  { key: 'entertainment', text: '🎬 Entertainment', value: 'ENTERTAINMENT' },
                  { key: 'bills', text: '💡 Bills & Utilities', value: 'BILLS' },
                  { key: 'shopping', text: '🛍️ Shopping', value: 'SHOPPING' },
                  { key: 'health', text: '💊 Healthcare', value: 'HEALTH' },
                  { key: 'other', text: '📦 Other', value: 'OTHER' },
                ]}
              />
              <Form.Input
                fluid
                label='Date'
                type='date'
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </Form.Group>
            
            <Form.TextArea
              label='Notes (optional)'
              placeholder='Additional details...'
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
            
            <Form.Field>
              <label>Receipt Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setSelectedFile(e.target.files[0])}
              />
              {selectedFile && <p style={{ marginTop: '5px', color: 'green' }}>✓ Selected: {selectedFile.name}</p>}
            </Form.Field>
            
            <Button primary onClick={handleAddExpense} loading={uploading}>
              <Icon name='plus' /> Add Expense
            </Button>
          </Form>

          {loading ? (
            <Loader active inline='centered' style={{ marginTop: '30px' }}>
              Loading expenses...
            </Loader>
          ) : (
            <Card.Group style={{ marginTop: '30px' }}>
              {expenses.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'gray', width: '100%' }}>
                  No expenses yet. Add your first expense above!
                </p>
              ) : (
                expenses.map(expense => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onToggleStatus={toggleStatus}
                    onDelete={removeExpense}
                  />
                ))
              )}
            </Card.Group>
          )}
        </Container>
      )}
    </Authenticator>
  );
}

export default App;