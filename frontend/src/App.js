import { Component } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import InsightsPanel from "./components/InsightsPanel";
import "./App.css";

class App extends Component {
  state = {
    tasks: [],
    insights: null,
    filters: {
      status: "",
      priority: "",
      sort: "",
    },
  };

  componentDidMount() {
    this.loadTasks();
    this.loadInsights();
  }

  loadTasks = async () => {
    const { filters } = this.state;
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.sort) params.append("sort", filters.sort);

    try {
      const response = await fetch(`http://localhost:5000/tasks?${params}`);
      if (response.ok) {
        const tasks = await response.json();
        this.setState({ tasks });
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  loadInsights = async () => {
    try {
      const response = await fetch("http://localhost:5000/insights");
      if (response.ok) {
        const insights = await response.json();
        this.setState({ insights });
      }
    } catch (error) {
      console.error("Failed to load insights:", error);
    }
  };

  handleTaskChange = () => {
    this.loadTasks();
    this.loadInsights();
  };

  updateFilters = (newFilters) => {
    this.setState({ filters: newFilters }, this.loadTasks);
  };

  render() {
    const { tasks, insights, filters } = this.state;

    return (
      <div className="app">
        <header className="header">
          <h1>Task Tracker</h1>
        </header>

        <main className="main">
          <InsightsPanel insights={insights} />

          <div className="tasks-layout">
            <TaskForm onTaskCreated={this.handleTaskChange} />
            <TaskList
              tasks={tasks}
              filters={filters}
              onFiltersChange={this.updateFilters}
              onTaskUpdated={this.handleTaskChange}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
