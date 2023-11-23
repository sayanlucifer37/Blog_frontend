import React, { useEffect, useState } from 'react';
import img1 from '@/assets/sliderTemp/img1.png';
import img2 from '@/assets/sliderTemp/img2.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface ParagraphData {
    title: string;
    description: string;
    image: File | null;
    imageUrl: string;
    position: string;
    createdAt: Number | null;
}

interface Blog {
    _id: string;
    title: string;
    description: string;
    image: File | null;
    imageUrl: string;
    paragraphs: ParagraphData[];
    category: string;
}

const HomeSlider = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    const get10latestblogs = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/blog`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.ok) {
                    console.log(response);
                    setBlogs(response.data.blogs);
                } else {
                    toast(response.message, {
                        type: 'error',
                    });
                }
            })
            .catch((error) => {
                toast(error.message, {
                    type: 'error',
                });
            });
    };

    useEffect(() => {
        // Calculate width and height on the client side
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        // Initial dimensions
        handleResize();

        // Add event listener to update dimensions on window resize
        window.addEventListener('resize', handleResize);

        // Remove event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        get10latestblogs();
    }, []);

    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            pagination={{
                clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
        >
            <>
                <SwiperSlide key="img1">
                    <Image src={img1} alt="" width={width} height={height / 2} style={{ objectFit: 'cover' }} />
                </SwiperSlide>

                <SwiperSlide key="img2">
                    <Image src={img2} alt="" width={width} height={height / 2} style={{ objectFit: 'cover' }} />
                </SwiperSlide>
            </>

            {blogs.length > 0 &&
                blogs.map((blog) => (
                    <SwiperSlide key={blog._id}>
                        <Image src={blog.imageUrl} alt="" width={width} height={height / 2} style={{ objectFit: 'cover' }} />
                    </SwiperSlide>
                ))}
        </Swiper>
    );
};

export default HomeSlider;
