function getNewExpirationTime() {
  return Date.now() + 15 * 1000;
}
let nextId = 0;

function generateId() {
  const result = nextId;
  nextId += 1;
  return result;
}

function Thought(props) {
  const { thought, removeThought } = props;

  React.useEffect(() => {
    const timeRemaining = thought.expiresAt - Date.now();
    const timeoutID = setTimeout(() => {
      removeThought(thought.id);
    }, timeRemaining);

    return () => { clearTimeout(timeoutID)}
  }, []);

  const handleRemoveClick = () => {
    removeThought(thought.id);
  };

  return (
    <li className="Thought">
      <button
        aria-label="Remove thought"
        className="remove-button"
        onClick={handleRemoveClick}
      >
        &times;
      </button>
      <div className="text">{thought.text}</div>
    </li>
  );
}

function AddThoughtForm(props) {

  const [text, setText] = React.useState('');

  const handleTextChange = ({ target }) => {
    setText(target.value);
  }

  const handleSubmit = event => {
    if (text) {
      event.preventDefault();
      const thought = {
        id: generateId(),
        text: text,
        expiresAt: getNewExpirationTime()
      }
        event.preventDefault();
        props.addThought(thought);
    } else {
      event.preventDefault();
    }

    setText('');
  }

  return (
    <form className="AddThoughtForm" onSubmit={handleSubmit}>
      <input
        type="text"
        aria-label="What's on your mind?"
        placeholder="What's on your mind?"
        value={text}
        onChange={handleTextChange}        
      />
      <input type="submit" value="Add" />
    </form>
  );
}

function App() {
  const [thoughts, setThoughts] = React.useState([
    {
      id: generateId(),
      text: 'This is a place for your passing thoughts.',
      expiresAt: getNewExpirationTime(),
    },
    {
      id: generateId(),
      text: "They'll be removed after 15 seconds.",
      expiresAt: getNewExpirationTime(),
    },
  ]);

  const addThought = thought => {
    setThoughts(prev => [thought, ...prev]);
  } 

  const removeThought = thoughtIdToRemove => {
    setThoughts((prev) => prev.filter(thought => thought.id !== thoughtIdToRemove));
  }

  return (
    <div className="App">
      <header>
        <h1>Passing Thoughts</h1>
      </header>
      <main>
        <AddThoughtForm addThought={addThought}/>
        <ul className="thoughts">
          {thoughts.map((thought) => (
            <Thought key={thought.id} thought={thought} removeThought={removeThought} />
          ))}
        </ul>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App/>);