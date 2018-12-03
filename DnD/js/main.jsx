class Main extends React.Component {
    state = {
        tasks: [
            {
                name: "Task example",
                category: "wip",
                bg_color: "yellow"
            }
        ]
    };

    // Used to block standard behavior
    ondragover = (ev) => {
        ev.preventDefault();
    };

    ondragstart = (ev, id) => {
        ev.dataTransfer.setData("id", id);
    };

    ondrop = (ev, category) => {
        let id = ev.dataTransfer.getData("id");
        let tasks = this.state.tasks.filter((task) => {
            if (task.name == id) {
                task.category = category;
            }
            return task;
        });
        this.setState({
            ...this.state,
            tasks
        });
    };

    render() {
        var task_categories = {wip: [], completed: []};
        this.state.tasks.forEach((t) => {
            task_categories[t.category].push(
                <div key={t.name}
                     onDragStart={(e) => this.ondragstart(e, t.name)}
                     draggable className="draggable"
                     style={{backgroundColor: t.bg_color}}>
                    <span>{t.name}</span>
                </div>
            );
        });

        return (
            <div className="row">
                <div className="col-mb-4"
                     onDragOver={(e) => this.ondragover(e)}
                     onDrop={(e) => this.ondrop(e, "wip")}
                     style={{width: 400, height: 800, backgroundColor: "grey", marginTop: 100}}>
                    <div>{task_categories.wip}</div>
                </div>
                <div className="col-mb-4"
                     onDragOver={(e) => this.ondragover(e)}
                     onDrop={(e) => this.ondrop(e, "completed")}
                     style={{width: 400, height: 800, backgroundColor: "darkgrey", marginTop: 100}}>
                    <div>{task_categories.completed}</div>
                </div>
            </div>
        )
            ;
    }
}

ReactDOM.render(
    <Main/>,
    document.getElementById('container')
);