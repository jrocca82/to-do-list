let taskdelete = (tag) => {
	fetch("/tasks/delete/" + tag.className, { method: "DELETE" });
	window.location.href = "/";
};

let redirect = (tag) => {
	console.log(tag.className);
	window.location = "/tasks/update/" + tag.className;
};

function addNewTask(tag) {
	if (document.getElementById("new-task").style.display === "block") {
		document.getElementById("new-task").style.display = "none";
		tag.innerText = "Add New Task";
	} else {
		document.getElementById("new-task").style.display = "block";
		tag.innerText = "Close";
	}
}

window.onload = async () => {
	console.log("dom content loaded");
	const res = await fetch("/tasks/index");
	const data = await res.json();
	data.forEach((item) => {
		tasks.innerHTML += `
        <li class='task-item'>${item.description}</li>
        <button class=${item._id} onclick="redirect(this)">Update</button>
        <button onclick='taskdelete(this)' class=${item._id}>Delete</button> <br/>`;
	});
};
