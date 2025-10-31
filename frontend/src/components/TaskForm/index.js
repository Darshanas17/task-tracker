import { Component } from "react";
import "./index.css";

class TaskForm extends Component {
  state = {
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    isSubmitting: false,
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { title, priority, dueDate, isSubmitting } = this.state;
    const { onTaskCreated } = this.props;

    if (isSubmitting) return;

    if (!title || !priority || !dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    this.setState({ isSubmitting: true });

    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: this.state.description,
          priority,
          due_date: dueDate,
        }),
      });

      if (response.ok) {
        this.setState({
          title: "",
          description: "",
          priority: "Medium",
          dueDate: "",
        });
        onTaskCreated();
      } else {
        alert("Failed to create task");
      }
    } catch (error) {
      alert("Failed to create task. Please try again.");
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  render() {
    const { title, description, priority, dueDate, isSubmitting } = this.state;

    return (
      <div className="form-container">
        <h2>Create New Task</h2>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="field">
            <label className="label">Task Title</label>
            <input
              type="text"
              name="title"
              className="input"
              value={title}
              onChange={this.handleChange}
              placeholder="What needs to be done?"
            />
          </div>

          <div className="field">
            <label className="label">Description</label>
            <textarea
              name="description"
              className="textarea"
              value={description}
              onChange={this.handleChange}
              placeholder="Add some details (optional)"
            />
          </div>

          <div className="field">
            <label className="label">Priority</label>
            <select
              name="priority"
              className="select"
              value={priority}
              onChange={this.handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="field">
            <label className="label">Due Date</label>
            <input
              type="date"
              name="dueDate"
              className="input"
              value={dueDate}
              onChange={this.handleChange}
            />
          </div>

          <button type="submit" className="button" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    );
  }
}

export default TaskForm;
