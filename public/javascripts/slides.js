window.addEventListener('load', function() {
    new Glider(document.querySelector('.glider'), {
        slidesToShow: 5,
        slidesToScroll: 5,
        dots: '.dots',
        draggable: true,
        arrows: {
            prev: '.glider-prev',
            next: '.glider-next',
        },
        responsive: [
            {
                breakpoint: 0,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                },
            }
        ]
    })
})