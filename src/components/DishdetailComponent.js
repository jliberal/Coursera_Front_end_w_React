import React from 'react';
import {
	Card,
	CardImg,
	CardText,
	CardImgOverlay,
	CardBody,
	CardTitle,
} from 'reactstrap';

function RenderDish({ dish }) {
	return (
		<div key={dish.id} className="col-12 col-md-5 m-1">
			<Card>
				<CardImg width="100%" src={dish.image} alt={dish.name}></CardImg>
				<CardBody>
					<CardTitle>{dish.name}</CardTitle>
					<CardText>{dish.description}</CardText>
				</CardBody>
			</Card>
		</div>
	);
}

function RenderComments({ comments }) {
	const allComments = comments.map((comment) => {
		return <RenderComment comment={comment} />;
	});

	return (
		<div key={comments.id} className="col-12 col-md-5 m-1">
			<div className="row">
				<div className="col-12">
					<h4>Comments</h4>
				</div>
			</div>
			<div className="row">{allComments}</div>
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
	if (dish != null) {
		return (
			<div className="container">
				<div className="row">
					<RenderDish dish={dish} />
					<RenderComments comments={dish.comments} />
				</div>
			</div>
		);
	} else {
		return <div className="row"></div>;
	}
};

export default DishDetail;
