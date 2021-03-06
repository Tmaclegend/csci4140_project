import React, { Component} from 'react'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import DiffMessage from './diffMessage';
import { isParenthesizedExpression } from '@babel/types';

class ChatMessage extends Component {
  constructor(props){
    super(props)
    this.state = {
      show :false
    }
  }
  
  change_show = (id) => {
    // this.setState(state => ({
    //   show: !state.show
    // }))
    this.props.history.push({
      pathname: '/corr',
      search: '?query=abc',
      state: { message_id: id, corr: this.props.corr}
    })
  }
  render() {
    const { chats_correction } = this.props.chats_correctionSub
    const k = chats_correction ? (
      chats_correction.map((corr, i) => (
          <DiffMessage
            message={this.props.message}
            corr_message={corr.corrected_message}
          />
      ))
    )
    : null
    return (
      <div className='ChatMessage'>
        {chats_correction && chats_correction.length > 0
          ?<div onClick={this.change_show.bind(this, this.props.message_id)} className="latest_message">
            <DiffMessage
              corr_message={chats_correction[chats_correction.length-1].corrected_message}
              message={this.props.message}
            />
          </div>
          :<div className='Message' onClick={this.change_show.bind(this, this.props.message_id)}>{this.props.message}</div>
        }
        {this.state.show
          ?<div>
            <div className='Message'>{this.props.message}</div>
            {k}
          </div>
          :null

        }
        
      </div>
    )
  }

}
const sub_chats_correction = gql`
  subscription chats_correction($message_id: Int!){
    chats_correction(where: {message_id: {_eq: $message_id}}) {
      corrected_message
      corrected_by
      created
      id
      message_id
    }
  }
`

export default graphql(sub_chats_correction, {
  name: "chats_correctionSub",
  options: (props) => {
    return{
      variables: {
        message_id: props.message_id
      }
    }
  }
})(ChatMessage)