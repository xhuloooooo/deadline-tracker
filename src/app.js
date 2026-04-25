// App.js
import React, { useState, useEffect } from 'react';
import './app.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({ name: '', deadline: '' });
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const addTask = () => {
    if (newTask.name.trim() && newTask.deadline) {
      setTasks([...tasks, { 
        id: Date.now(), 
        name: newTask.name.trim(), 
        deadline: newTask.deadline 
      }]);
      setNewTask({ name: '', deadline: '' });
    }
  };

  const isOverdue = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(deadline);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const isCurrentWeek = (deadline) => {
    const today = new Date();
    const taskDate = new Date(deadline);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return taskDate >= startOfWeek && taskDate <= endOfWeek;
  };

  const getFilteredTasks = () => {
    const sorted = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    if (filter === 'week') return sorted.filter(task => isCurrentWeek(task.deadline));
    if (filter === 'overdue') return sorted.filter(task => isOverdue(task.deadline));
    return sorted;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="app">
      <div className="container">
        <h1>📋 Дедлайны заданий</h1>
        
        <div className="current-date">
          📅 {currentDate.toLocaleDateString('ru-RU', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>

        <div className="add-task">
          <input
            type="text"
            placeholder="Название задания"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          />
          <button onClick={addTask}>➕ Добавить</button>
        </div>

        <div className="filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            Все задания
          </button>
          <button className={filter === 'week' ? 'active' : ''} onClick={() => setFilter('week')}>
            Текущая неделя
          </button>
          <button className={filter === 'overdue' ? 'active' : ''} onClick={() => setFilter('overdue')}>
            Просроченные
          </button>
        </div>

        <div className="tasks-list">
          {filteredTasks.length === 0 ? (
            <div className="empty">Нет заданий</div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task ${isOverdue(task.deadline) ? 'overdue' : ''}`}>
                <div className="task-name">{task.name}</div>
                <div className="task-date">
                  🗓️ {formatDate(task.deadline)}
                  {isOverdue(task.deadline) && <span className="overdue-badge"> Просрочено!</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;