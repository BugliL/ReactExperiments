class Postit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {task: props.task};
    }

    ondragstart = (ev, id) => {
        ev.dataTransfer.setData("drag_id", id);
    };

    render() {
        return (
            <div key={this.state.task.name}
                 onDragStart={(e) => this.ondragstart(e, this.state.task.name)}
                 draggable className="draggable"
                 style={{backgroundColor: this.state.task.bg_color}}>
                <span>{this.state.task.name}</span>
            </div>
        );
    }
}

class Column extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            category: props.category,
            tasks: props.tasks, //props.board.state.task_categories[props.category],
            bg_color: props.bg_color,
            board: props.board,
            task_list: props.board.state.tasks
        };
    }

    // Used to block standard behavior
    ondragover = (ev) => {
        ev.preventDefault();
    };

    ondrop = (ev, category) => {
        let drag_id = ev.dataTransfer.getData("drag_id");
        var tasks = this.state.task_list.filter((task) => {
            if (task.name == drag_id) {
                task.category = category;
            }
            return task;
        });

        this.state.board.setState({
            ...this.state,
            tasks
        });

    };

    render() {


        return (
            <div className="col-mb-4"
                 onDragOver={(e) => this.ondragover(e)}
                 onDrop={(e) => this.ondrop(e, this.state.category)}
                 style={{width: 400, height: 800, backgroundColor: this.state.bg_color, marginTop: 100}}>
                <div>{this.state.tasks}</div>
            </div>
        );
    }
}


class Board extends React.Component {
    state = {
        tasks: [
            {
                name: "Task example",
                category: "wip",
                bg_color: "yellow"
            }
        ],

        // task_categories : {wip: [], completed: []}
    };

    render() {
        var task_categories = {wip: [], completed: []};
        this.state.tasks.forEach((t) => {
            task_categories[t.category].push(
                new Postit({task: t}).render()
            );
        });
        console.log(task_categories);
        // this.state.task_categories = task_categories;

        return (
            <div className="row">
                <Column category="wip" bg_color="grey" board={this} tasks={task_categories["wip"]}/>
                <Column category="completed" bg_color="darkgrey" board={this} tasks={task_categories["completed"]}/>
            </div>
        );
    }
}

ReactDOM.render(
    <Board/>,
    document.getElementById('container')
);