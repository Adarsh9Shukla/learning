import { useReducer } from "react";
import "./App.css";
interface TodoState {
  todos: string[];
  todo: string;
}

// 2. Define strict action types using a Union type
type TodoAction =
  | { type: "addTodo"; payload: string }
  | { type: "display"; payload: string };
function App() {
  const [state, dispatch] = useReducer(
    (state: TodoState, action: TodoAction) => {
      switch (action.type) {
        case "addTodo":
          return {
            ...state,
            todos: [...state.todos, action.payload],
            todo: "",
          };

        case "display":
          return {
            ...state,
            todo: action.payload,
          };
        default:
          return state;
      }
    },

    {
      todos: [],
      todo: "",
    },
  );
  return (
    <>
      <div>
        <input
          type="text"
          value={state.todo}
          onChange={(e) =>
            dispatch({ type: "display", payload: e.target.value })
          }
        />
        <button
          onClick={() => dispatch({ type: "addTodo", payload: state.todo })}
        >
          Add
        </button>
      </div>
      <div>
        {state.todos.map((todo) => (
          <div key={todo}>{todo}</div>
        ))}
      </div>
    </>
  );
}

export default App;
