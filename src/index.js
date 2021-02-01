import React from 'react'
import ReactDom from 'react-dom'

class ParentDiv extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: null,
            selectedUser: null,
            userPosts: null
        }
        this.onUserSelectChange = this.onUserSelectChange.bind(this)
    }

    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/users')
        .then(
            (response) => {
                return response.json()
            }
        ).then((data) => {
            let userList = data.map((item) => {
                return {
                    id: item.id,
                    name: item.name
                }
            })
            this.setState({
                users: userList,
            })
        })
    }

    onUserSelectChange(element) {
        let userId = element.target.value
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .then(
            (response) => {
                return response.json()
            }
        ).then((data) => {
            let userPosts = data.map((item) => {
                return {
                    id: item.id,
                    title: item.title,
                    body: item.body
                }
            })
            this.setState({
                selectedUser: userId,
                userPosts: userPosts
            })
        })
    }

    render() {
        return this.state.users ? (
            <div>
                <UserSelect users={this.state.users} onChange={this.onUserSelectChange} />
                <ShowPostsButton userId={this.state.selectedUser} />
                <UserPostsTable userPosts={this.state.userPosts} />
            </div>
        ) : <span>Carregando Usuarios...</span>
    }
}

class UserSelect extends React.Component {

    render() {
        const users = this.props.users
        const options = users.map((item) => {
            return (
                <option key={item.id} value={item.id}>{item.name}</option>
            )
        })
        return (
            <select name="user-select" onChange={this.props.onChange}>
                <option value="">------------</option>
                {options}
            </select>
        )
    }
}

class ShowPostsButton extends React.Component {
    render() {
        return (
            <button>Ver Posts</button>
        )
    }
}

class UserPostsTable extends React.Component {
    render() {
        if (this.props.userPosts) {
            const rows = this.props.userPosts.map((item) => {
                return (<tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.body}</td>
                        </tr>
                )
            })
            return this.props.userPosts.length > 0 ? (
                <table>
                    <thead>
                        <th>Título</th>
                        <th>Corpo</th>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            ) : <span>Não há postagens</span>
        } else {
            return (
                <span>Selecione um usuário</span>
            )
        }
    }
}

ReactDom.render(
    <ParentDiv />, document.getElementById('root')
)
