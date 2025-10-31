import { Component } from "react";
import "./index.css";

class TaskList extends Component {
  handleStatusChange = async (taskId, newStatus) => {
    const { onTaskUpdated } = this.props;

    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        onTaskUpdated();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      alert("Failed to update status. Please try again.");
    }
  };

  handlePriorityChange = async (taskId, newPriority) => {
    const { onTaskUpdated } = this.props;

    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (response.ok) {
        onTaskUpdated();
      } else {
        alert("Failed to update priority");
      }
    } catch (error) {
      alert("Failed to update priority. Please try again.");
    }
  };

  handleFilterChange = (type, value) => {
    const { filters, onFiltersChange } = this.props;
    onFiltersChange({ ...filters, [type]: value });
  };

  render() {
    const { tasks, filters } = this.props;

    return (
      <div className="task-list">
        <div className="header">
          <h2>
            Your Tasks <span className="count">({tasks.length})</span>
          </h2>

          <div className="filters">
            <select
              className="filter"
              value={filters.status}
              onChange={(e) =>
                this.handleFilterChange("status", e.target.value)
              }
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <select
              className="filter"
              value={filters.priority}
              onChange={(e) =>
                this.handleFilterChange("priority", e.target.value)
              }
            >
              <option value="">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              className="filter"
              value={filters.sort}
              onChange={(e) => this.handleFilterChange("sort", e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
        <div className="task-list-items">
          {tasks.length === 0 ? (
            <div className="empty">
              <p>No tasks found. Create your first task to get started!</p>
            </div>
          ) : (
            <ul className="tasks">
              {tasks.map((task) => (
                <li key={task.id} className="task">
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <div className="task-meta">
                      <span
                        className={`badge priority-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`badge status-${task.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>

                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}

                  <div className="task-details">
                    <span>
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                    <span>
                      Created: {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="actions">
                    <select
                      className="action"
                      value={task.status}
                      onChange={(e) =>
                        this.handleStatusChange(task.id, e.target.value)
                      }
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>

                    <select
                      className="action"
                      value={task.priority}
                      onChange={(e) =>
                        this.handlePriorityChange(task.id, e.target.value)
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export default TaskList;
