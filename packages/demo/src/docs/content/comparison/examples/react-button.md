```jsx
function Button({ label, onClick }) {
  const [clicked, setClicked] = useState(false);

  return (
    <button
      className={clicked ? 'btn-clicked' : 'btn'}
      onClick={() => {
        setClicked(true);
        onClick();
      }}
    >
      {label}
    </button>
  );
}
```