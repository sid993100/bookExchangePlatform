const React = require('react');
import ExchangeRow from '../components/ExchangeRow';

class Exchange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
         incomingRequests: [],
         outgoingRequests: []
        };

        this.shipped = this.shipped.bind(this);
    }

    componentDidMount() {
      this.getIncomingInfo();
      this.getOutgoingInfo();
    }
      // INCOMING BOOK REQUEST
  
    getIncomingInfo () {
        fetch(`/api/getIncomingInfo/${this.props.userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({incomingRequests: data})
        })
        .catch(err => {
            console.log(`Error getIncomingInfo Method ${err}`)
        })
    }

    getOutgoingInfo () {
        // What do we expect back from server?
        fetch(`/api/getOutgoingInfo/${this.props.userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({outgoingRequests: data})
        })
        .catch(err => {
            console.log(`Error getOutgoingInfo Method ${err}`)
        })
    }


    shipped (event) {
        const row = event.target.id; // ??? pretty sure this is right yeah probably
        const body = {
          title: this.state.incomingRequests[row].title,
          username: this.state.incomingRequests[row].userId,
        };
        // Send post request to remove row from users_books table.
        // Body of request will have book isbn and requester username.
        // Server will query database for row in users_books where isbn and requester username match request body.
        // Get Users Books table
        fetch('/api/shipped'), {
            method: 'POST',
            body: JSON.stringify(body),
        }
        // .then(response => response.json())
        .then(this.getIncomingInfo())
        .catch(err => {
            console.log(`Error in shipped function ${err}`)
        })
    }

    // OUTGOING BOOK REQUEST
    render () {
        return (
            <div className='exchange'>
                  {/* Incoming Request Table  */}
                  <h3 className='incoming'>Incoming Requests</h3>
                  {/* {this.state.incomingRequests.length > 0 && ( */}
                      <table class="table table-bordered">
                      <thead>
                          <tr>
                          <th scope="col">Book Requested</th>
                          <th scope="col">User</th>
                          <th scope="col">Email</th>
                          <th scope="col">Mark As Shipped</th>
                          </tr>
                      </thead>
                      <tbody>
                          {this.state.incomingRequests.map((req, i) => {
                          return (<tr key={i}>
                              <th scope="row">{req.title}</th>
                              <td>{req.username}</td>
                              <td>{req.email}</td>
                              <td><button id={i} onClick={this.shipped}>Mark as Shipped</button></td>
                          </tr>)
                          })}
                      </tbody>
                      </table>
                  {/* )} */}
                  {/* Outgoing Request Table  */}
                  <h3 className='incoming'>Outgoing Requests</h3>
                  {this.state.outgoingRequests.length > 0 && (
                      <table class="table table-bordered">
                      <thead>
                          <tr>
                          <th scope="col">Book Requested</th>
                          <th scope="col">User</th>
                          <th scope="col">Email</th>
                          <th scope="col">Shipping Status</th>
                          </tr>
                      </thead>
                      <tbody>
                          {this.state.outgoingRequests.map((req, i) => {
                          return (<tr key={i}>
                              <th scope="row">{req.title}</th>
                              <td>{req.username}</td>
                              <td>{req.email}</td>
                              <td>Pending...</td>
                          </tr>)
                          })}
                      </tbody>
                      </table>
                      )}
              </div>
       )
    }
}


export default Exchange;