interface CardProps{
    title: string;
    gender: string;
    imageUrl: string;
    isFeatures?: boolean;
}



function Cards(
    {
        title,
        gender,
        imageUrl,
        isFeatures
    }: CardProps) {
        return(

            <div className="col-md-4 mb-4">
                {isFeatures && (
                    <div className="position-absolute top-0 end-0 p-2">
                        <span className="badge bg-primary">Destaque</span>
                    </div>
                )}

                <img 
                src={imageUrl}
                className="card-img-top"
                alt={title}
                style={{height: '200px', objectFit:'cover'}}
                />

                <div className="card-body text-center">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text mb-3">{gender}</p>
                    <a href="#" className="btn btn-primary"></a>

                </div>
            </div>
        )
    }


export default Cards