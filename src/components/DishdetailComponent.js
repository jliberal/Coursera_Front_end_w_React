import React, { Component } from 'react';
import {
	Card,
	CardImg,
	CardText,
	CardBody,
	CardTitle,
	Breadcrumb,
	BreadcrumbItem,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Label,
	Col,
	Row,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;
const isNumber = (val) => !isNaN(Number(val));

function RenderDish({ dish }) {
	return (
		<div key={dish.id} className="col-12 col-md-5 m-1">
			<FadeTransform
				in
				transformProps={{
					exitTransform: 'scale(0.5) translateY(-50%)',
				}}
			>
				<Card>
					<CardImg
						width="100%"
						src={baseUrl + dish.image}
						alt={dish.name}
					></CardImg>
					<CardBody>
						<CardTitle>{dish.name}</CardTitle>
						<CardText>{dish.description}</CardText>
					</CardBody>
				</Card>
			</FadeTransform>
		</div>
	);
}

function RenderComments({ comments, postComment, dishId }) {
	const allComments = comments.map((comment) => {
		return (
			<Fade in>
				<RenderComment comment={comment} />
			</Fade>
		);
	});

	return (
		<div key={comments.id} className="col-12 col-md-5 m-1">
			<div className="row">
				<div className="col-12">
					<h4>Comments</h4>
				</div>
			</div>
			<div className="row">
				<Stagger in>{allComments}</Stagger>
			</div>
			<div>
				<CommentForm dishId={dishId} postComment={postComment} />
			</div>
		</div>
	);
}

function RenderComment({ comment }) {
	return (
		<div className="col-12">
			<ul key={comment.id} className="list-unstyled">
				<li>{comment.comment}</li>
				<li>
					-- {comment.author},{' '}
					{new Intl.DateTimeFormat('en-US', {
						year: 'numeric',
						month: 'short',
						day: '2-digit',
					}).format(new Date(Date.parse(comment.date)))}
				</li>
			</ul>
		</div>
	);
}

const DishDetail = (props) => {
	const dish = props.dish;

	if (props.isLoading) {
		return (
			<div className="container">
				<div className="row">
					<Loading />
				</div>
			</div>
		);
	} else if (props.errMess) {
		return (
			<div className="container">
				<div className="row">
					<h4>{props.errMess}</h4>
				</div>
			</div>
		);
	} else if (dish != null) {
		dish.comments = props.comments;
		return (
			<div className="container">
				<div className="row">
					<Breadcrumb>
						<BreadcrumbItem>
							<Link to="/menu">Menu</Link>
						</BreadcrumbItem>
						<BreadcrumbItem active>{dish.name}</BreadcrumbItem>
					</Breadcrumb>
					<div className="col-12">
						<h3>{dish.name}</h3>
						<hr />
					</div>
				</div>
				<div className="row">
					<RenderDish dish={dish} />
					<RenderComments
						comments={dish.comments}
						postComment={props.postComment}
						dishId={props.dish.id}
					/>
				</div>
			</div>
		);
	} else {
		return <div className="row"></div>;
	}
};

class CommentForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalOpen: false,
		};
		this.toggleModal = this.toggleModal.bind(this);
		//this.handleLogin = this.handleLogin.bind(this);
	}

	toggleModal() {
		this.setState({
			isModalOpen: !this.state.isModalOpen,
		});
	}

	handleSubmit(values) {
		console.log('Current State is: ' + JSON.stringify(values));
		alert('Current State is: ' + JSON.stringify(values));
		this.props.postComment(
			this.props.dishId,
			values.rating,
			values.name,
			values.message
		);
	}

	render() {
		return (
			<React.Fragment>
				<Button outline onClick={this.toggleModal}>
					<span className="fa fa-pencil fa-lg"></span> Submit Comment
				</Button>

				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
					<ModalBody>
						<LocalForm onSubmit={(values) => this.handleSubmit(values)}>
							<Row className="form-group">
								<Label htmlFor="rating" md={2}>
									Rating
								</Label>
								<Col md={10}>
									<Control.select
										model=".rating"
										id="rating"
										name="rating"
										placeholder="Rating"
										className="form-control"
										validators={{
											required,
											isNumber,
										}}
									>
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="3">3</option>
										<option value="4">4</option>
										<option value="5">5</option>
									</Control.select>
									<Errors
										className="text-danger"
										model=".rating"
										show="touched"
										messages={{
											required: 'Required',
											maxFive: 'Must be numbers between 1 and 5',
										}}
									/>
								</Col>
							</Row>
							<Row className="form-group">
								<Label htmlFor="name" md={2}>
									Your Name
								</Label>
								<Col md={10}>
									<Control.text
										model=".name"
										id="name"
										name="name"
										placeholder="Name"
										className="form-control"
										validators={{
											required,
											minLength: minLength(3),
											maxLength: maxLength(15),
										}}
									/>
									<Errors
										className="text-danger"
										model=".name"
										show="touched"
										messages={{
											required: 'Required',
											minLength: 'Must be greater than 2 characters',
											maxLength: 'Must be 15 characters or less',
										}}
									/>
								</Col>
							</Row>
							<Row className="form-group">
								<Label htmlFor="message" md={2}>
									Comment
								</Label>
								<Col md={10}>
									<Control.textarea
										model=".message"
										id="message"
										name="message"
										rows="12"
										className="form-control"
									></Control.textarea>
								</Col>
							</Row>
							<Row className="form-group">
								<Col md={{ size: 10, offset: 2 }}>
									<Button type="submit" color="primary">
										Send Feedback
									</Button>
								</Col>
							</Row>
						</LocalForm>
					</ModalBody>
				</Modal>
			</React.Fragment>
		);
	}
}

export default DishDetail;
