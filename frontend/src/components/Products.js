import React from 'react';

export default function Products() {
    return (
        <div>
            <Card body className="text-center">
                <CardImg src={val.image} alt={val.name} top width="100%" />
                <CardTitle tag="h5">{val.name}</CardTitle>
                <CardText>{val.quantity}</CardText>
                <CardText>{val.price}</CardText>
                <CardText>{val.description}</CardText>
                <div className="d-flex flex-row">
                    <Button className="w-50 m-2" onClick={() => toggle(val.id)}>
                        <Link className="nav-link" to={`/edit/${val.id}`}>
                            Edit
                        </Link>
                    </Button>
                    <Button
                        className="w-50 m-2"
                        onClick={(event) => {
                            event.preventDefault();
                            deleteProduct(val.id);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </Card>
        </div>
    );
}
