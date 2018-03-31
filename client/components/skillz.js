import React, {  Component } from 'react'


export default class Skillz extends Component{
  constructor(){
    super();
  }
  render(){
    const { name, skills,image } = this.props;
    return (
        <article className="search-result row">
          <div className="col-xs-12 col-sm-12 col-md-3">
            <a href="#" title="Lorem ipsum" className="thumbnail"><img src={image} alt="Lorem ipsum" /></a>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-2">
            <ul className="meta-search">
            <li><i className="glyphicon glyphicon-calendar" /> <span className="mentor-name">{name.slice(0, name.length -10)}</span></li>
              {skills.length && skills.map(skill=>{
              return (<li key={skill} ><i className="glyphicon glyphicon-time" /> <span className="single-skill" >{skill}</span></li>)
              })}
            </ul>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-7 excerpet">
            <h3></h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, exercitationem, suscipit, distinctio, qui sapiente aspernatur molestiae non corporis magni sit sequi iusto debitis delectus doloremque.</p>
            <span className="plus"><i className="glyphicon glyphicon-plus" /></span>
          </div>
          <span className="clearfix borda" />
        </article>
    )
  }
}
