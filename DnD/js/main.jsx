class Postit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {task: props.task};
    }

    ondragstart = (ev, id) => {
        ev.dataTransfer.setData("drag_id", id);
        ev.dataTransfer.setData("old_category", this.state.task.category);
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
            tasks: props.tasks,
            bg_color: props.bg_color,
            board: props.board,
            task_list: props.board.state.tasks
        };

        props.board.registerToNotify(this);
    }

    ondragover = (ev) => {
        ev.preventDefault();
    };

    ondrop = (ev, category) => {
        let drag_id = ev.dataTransfer.getData("drag_id");
        let old_category = ev.dataTransfer.getData("old_category");

        var tasks = this.state.board.state.tasks.filter((task) => {
            if (task.name === drag_id) {
                task.category = category;
            }
            return task;
        });

        this.state.board.handleOnDrop(tasks);
    };

    render() {
        console.log(this.state.category);
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
            {name: "Learn Angular", category: "wip", bg_color: "yellow"},
            {name: "React", category: "wip", bg_color: "pink"},
            {name: "Vue", category: "completed", bg_color: "skyblue"}
        ],
        categories: ['wip', 'completed']
    };

    columns = [];
    handleOnDrop = (tasks) => {
        this.setState({
            ...this.state,
            tasks
        });

        var tasks = this.getTaksByCategories();
        this.columns.forEach((column) => {
            column.setState({tasks: tasks[column.state.category]});
        });
    };

    getTaksByCategories = () => {
        var task_categories = {};
        this.state.categories.map((c) => {
            task_categories[c] = [];
        });

        var i = 0;
        this.state.tasks.forEach((t) => {
            task_categories[t.category].push(
                <Postit task={t} key={++i}/>
            );
        });
        return task_categories;
    };

    registerToNotify = (column) => {
        this.columns.push(column);
    };

    render() {
        var task_categories = this.getTaksByCategories();
        var board = this;
        var i = 0;
        console.log(this.state.tasks);
        return (
            <div className="row">
                {this.state.categories.map((category) =>
                    <Column category={category}
                            bg_color="darkgrey"
                            key={++i}
                            board={board}
                            tasks={task_categories[category]}/>
                )}
            </div>
        );
    }
}

ReactDOM.render(
    <Board/>,
    document.getElementById('container')
);