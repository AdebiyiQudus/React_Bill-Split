// Prop drilling =>This is a process of passing data from a parent componrnt down to nested child components through props, even if those intermediate components do not directly use the data.

import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({children, onClickProps}) {
  return <button className="button" onClick={onClickProps}>
    {children}</button>
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);
    // Event Handlers
  function handleShowAddFriend() {
    setShowAddFriend((showAddFriend) => !showAddFriend)
  }

  function handleAddFriend(newFriendObj) {
    setFriends((friends) => [...friends, newFriendObj])
    setShowAddFriend(false)
  }

  function handleSelection(friendObj) {
    setSelectedFriend((curSelected) => 
 // if the curSelected id === friendObj id clicked (form bill will be open) then close the form
    curSelected?.id === friendObj.id ? null : friendObj)
    setShowAddFriend(false);
  }

  function handleSplitBill(splitBillValue) {
    console.log(splitBillValue)

    setFriends((friends) =>
    friends.map((friendObj) =>
    // Loop through the friends(initialFriends) Array, if the friendObj id === selectedFriend id return the friendsArr, friendObj balance = value else if the current friend is not the one to be updated return that friendObj unchanged
      friendObj.id === selectedFriend.id ?
        { ...friendObj, balance: friendObj.balance + splitBillValue}
        : friendObj
    )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">

        <FriendsList friendsProps={friends}
          selectedFriendProps={selectedFriend} 
          onSelectionProps={handleSelection}
          />

        {showAddFriend && <FormAddFriend 
        onAddFriendProps={handleAddFriend}
        />}
       
        <Button onClickProps={handleShowAddFriend}>
         {/* If showAddFriend is true set button text to "Close" else set to "Add friend" */}
         {showAddFriend ? "close" : "Add friend"}
         </Button>
      </div>

     {selectedFriend && <FormSplitBill
      selectedFriendProps={selectedFriend}
      onSplitBillProps ={handleSplitBill}
      />}
    </div>
  );
}
 
function FriendsList({ friendsProps, 
  onSelectionProps, selectedFriendProps}) {

    return (
    <ul>
      {friendsProps.map((friendObj) => (
        <Friend friendProps={friendObj}
        key={friendObj.id} 
        selectedFriendProps={selectedFriendProps}
        onSelectionProps={onSelectionProps }
        />
      ))}
    </ul>
  );
}

function Friend({friendProps, 
  onSelectionProps, selectedFriendProps}) {

    // Using Optional chaining => Compare selected friends with current friendobj
  const isSelected = selectedFriendProps?.id === friendProps.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friendProps.image} alt={friendProps.name} />
      <h3>{friendProps.name}</h3>

      {friendProps.balance < 0 && (
        <p className="red">
          You owe {friendProps.name} ${Math.abs(friendProps.balance)}
        </p>
      )}

      {friendProps.balance > 0 && (
        <p className="green">
          {friendProps.name} owes you ${Math.abs(friendProps.balance)}
        </p>
      )}

      {friendProps.balance === 0 && (
        <p>
          You and {friendProps.name} are even
        </p>
       )}
      
      <Button onClickProps={() => onSelectionProps(friendProps)}>
        {isSelected ? "Close" : "Select"}
        </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriendProps }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    // Using guard clause
    if (!name || !image) return;

    // To generate random Id in the browser
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriendProps(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />

      <label> 🌄 Image URL </label>
      <input type="text" 
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriendProps, onSplitBillProps }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");

  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

 // if the friend pays the bill => Negative balance(User) are owned by the user(You) i.e user(You) is owing a friend
// If User(You) pays the bill => Positive balance(On user) which means friend is owing the user   
    if (!bill || !paidByUser) return;
    onSplitBillProps(whoIsPaying === "user" ? paidByFriend :
    -paidByUser)
  }

  return (
    <form className="form-split-bill"
    onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriendProps.name}</h2>

    <label>💰 Bill value</label>
    <input 
      type="text"
      value={bill}
      onChange={(e) => setBill(Number(e.target.value))} 
      />

    <label>🧍‍♂️ Your expense</label>
    <input 
      type="text"
      value={paidByUser}
      onChange={(e) => 
  // If your expense value > bill then it will return the value inputed before > the bill else return the initial value inputed
        setPaidByUser(Number(e.target.value) > bill ? paidByUser :
        Number(e.target.value))} 
      />
 
    <label>👭 {selectedFriendProps.name}'s expense </label>
    <input 
      type="text" disabled 
      value={paidByFriend}
    />

    <label>🤑 Who is paying the bill</label>
    <select
      value={whoIsPaying}
      onChange={(e) => setWhoIsPaying(e.target.value)}
    >
      <option value="user">You</option>
      <option value="friend">{selectedFriendProps.name} </option>
    </select>
    
    <Button>Split bill</Button>
    </form>
  )
}
