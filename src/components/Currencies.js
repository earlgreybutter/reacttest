import React, {Component} from 'react';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import AddCurrency from './AddCurrency';

class Currencies extends Component {
    constructor(props){
        super(props);
        this.state = {currencies:[]};
    }

    componentDidMount(){
        fetch('http://localhost:8080/currencies', 
        {headers: { "Authorization":"Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTU5NTk4Njc4MH0.0dPkzhbNG4ftdCOc0jsfZuYHi1ExCc_2xbYsruvMNKf66IWdRfYXHxMQ0ozxVEX_JKAQ-i_hi77ZgUh2Zuc7vA"}})
        .then((response)=>response.json())
        .then((responseData)=>{
            this.setState({
                currencies: responseData
            })
        })
        .catch(err => console.error(err))
    }

    fetchCurrencies = () => {
        fetch('http://localhost:8080/currencies', 
        {headers: { "Authorization":"Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTU5NTk4Njc4MH0.0dPkzhbNG4ftdCOc0jsfZuYHi1ExCc_2xbYsruvMNKf66IWdRfYXHxMQ0ozxVEX_JKAQ-i_hi77ZgUh2Zuc7vA", 
            "Content-Type":"application/json"}})
        .then((response)=>response.json())
        .then((responseData)=>{
            this.setState({
                currencies: responseData
            })
        })
        .catch(err => console.error("error: " + err));
    }

    onDelClick = (id) => {
        if(window.confirm('Are you sure to delete currency?')){
            fetch('http://localhost:8080/currencies/' + id, {
                method : 'DELETE', 
                headers : new Headers({
                    "Authorization":"Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTU5NTk4Njc4MH0.0dPkzhbNG4ftdCOc0jsfZuYHi1ExCc_2xbYsruvMNKf66IWdRfYXHxMQ0ozxVEX_JKAQ-i_hi77ZgUh2Zuc7vA"
                }) 
            }).then(res => this.fetchCurrencies())
                .catch(err => console.error(err));
        }
    }

    updateCurrency(currency){
        fetch('http://localhost:8080/currencies', {
            method : 'PUT', 
            headers : {
                "Authorization" : "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTU5NTk4Njc4MH0.0dPkzhbNG4ftdCOc0jsfZuYHi1ExCc_2xbYsruvMNKf66IWdRfYXHxMQ0ozxVEX_JKAQ-i_hi77ZgUh2Zuc7vA",
                "Content-Type" : "application/json"
            }, 
            body : JSON.stringify(currency)
        })
            .then(res => this.fetchCurrencies())
            .catch(err => console.log(err))
    }

    editable = (cell) => {
        return(
            <div
                style = {{backgroundColor:"#fafafa"}} contentEditable suppressContentEditableWarning onBlur={e=> {
                    const curr = [...this.state.currencies];
                    curr[cell.index][cell.column.id] = e.target.innerHTML;
                    this.setState({currencies:curr});
                }}
                dangerouslySetInnerHTML={{__html:this.state.currencies[cell.index][cell.column.id]}}
            />
        );
    };

    render(){
        
        const columns =[{
            Header : 'Currency', 
            accessor : 'name', 
            Cell : this.editable
        }, {
            Header : 'Code', 
            accessor : 'code', 
            Cell : this.editable
        }, {
            Header : 'Amount', 
            accessor : 'amount'
        }, {
            Header : 'Rate', 
            accessor : 'rate'
        },{
            sortable:false, 
            filterable:false, 
            width:100, 
            Cell:row => (
                <div>
                    <button onClick={() => this.onDelClick(row.original.id)}>Delete</button>
                </div>
            )
        },{
            sortable:false, 
            filterable:false, 
            width:100, 
            Cell:row => (
                <div>
                    <button onClick={()=>this.updateCurrency(row.original)}>Save</button>
                </div>
            )
        }
        ,];

        return (
            <div>
                <AddCurrency addCurrency={this.addCurrency} fetchCurrencies = {this.fetchCurrencies}/>
                <ReactTable data={this.state.currencies} columns={columns} filterable={true}/>
            </div>
        );
    }
}

export default Currencies;