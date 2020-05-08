import React, { Component, useCallback } from "react";
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Modal, ModalHeader, ModalBody, Button, Row, Col, Label} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

// import CommentForm from "./CommentFormComponent";

function RenderDish(dishDetail) {
  return (
    <Card>
      <CardImg top src={baseUrl + dishDetail.image} alt={dishDetail.name} />
      <CardBody>
        <CardTitle>{dishDetail.name}</CardTitle>
        <CardText>{dishDetail.description}</CardText>
      </CardBody>
    </Card>
  );
}

function RenderComments({comments, addComment, dishId}) {
  var commentList = comments.map(comment => {
    return (
        <li key={comment.id} >
            {comment.comment}
            <br /><br />
            -- {comment.author}, {new Intl.DateTimeFormat("en-US", {
              year:"numeric",
              month:"long",
              day:"2-digit"
            }).format(new Date(comment.date))}
            <br /><br />
        </li>
    );
});

return (
    <div>
        <h4>Comments</h4>
        <ul className="list-unstyled">
            {commentList}
        </ul>
        <CommentForm dishId={dishId} addComment={addComment}  />
        <br/ >
    </div>
);
  
}

const DishDetail = (props) => {
  
  if(props.isLoading) {
    return (
      <div className="container">
        <div className="row">
            <Loading />
          </div>
      </div>
    );
  } 
  else if(props.errMess) {
    return (
      <div className="container">
          <div className="row">
            <h4>{props.errMess}</h4>
          </div>
      </div>
    );
  }
  else if(props.dish!=null){
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/menu">Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish {...props.dish} />
          </div>
          <div className="col-12 col-md-5 m-1">
            <RenderComments comments={props.comments} 
              addComment={props.addComment}
              dishId={props.dish.id}  />
          </div>
        </div>
      </div>
    );
  }
  else{
    return(
      <div></div>
    );
  }
};

// CommentForm Component and it's helper functions

const required = val => val && val.length;
const maxLength = len => val => !val || val.length <= len;
const minLength = len => val => val && val.length >= len;

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }
  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }
  submitComment(values) {
    this.toggleModal();
    this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
  }
  render() {
    return (
      <div>
        <button
          className="btn btn-light border border-dark"
          onClick={this.toggleModal}
        ><span className="fa fa-pencil fa-lg">Submit Comment</span> 
        </button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={values => this.submitComment(values)}>
              <Row className="form-group">
                <Label htmlFor="rating" md={12}>
                  Rating
                </Label>
                <Col md={12}>
                  <Control.select
                    model=".rating"
                    id=".rating"
                    name=".rating"
                    className="form-control"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="name" md={12}>
                  Your Name
                </Label>
                <Col md={12}>
                  <Control.text
                    model=".author"
                    id="author"
                    name="author"
                    placeholder="Author Name"
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(3),
                      maxLength: maxLength(15)
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".name"
                    show="touched"
                    messages={{
                      required: "Required ",
                      minLength: "Must be greater than 2 characters",
                      maxLength: "Must be 15 characters or less"
                    }}
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Label htmlFor="comment" md={12}>
                  Comment
                </Label>
                <Col md={12}>
                  <Control.textarea
                    model=".comment"
                    id="comment"
                    name="comment"
                    placeholder="Your comment goes here."
                    rows="6"
                    className="form-control"
                  />
                </Col>
              </Row>
              <Row className="form-group">
                <Col md={{ size: 10 }}>
                  <Button type="submit" color="primary">
                    Send Feedback
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default DishDetail;