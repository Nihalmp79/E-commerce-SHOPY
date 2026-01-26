import  { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import login from '../assets/login.webp';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice'

const Login = () => {
    const [email,setEmail] = useState("");
    const [password,setPasword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const {user, guestId, loading} = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);
    
    // Get redirect parameter and check if it's checkout or somthing
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    


    useEffect(() => {
        if (!user) return;
    
        const handleRedirect = async () => {
            if (cart?.products?.length > 0 && guestId) {
                await dispatch(mergeCart({ guestId, user }));
            }
            navigate(redirect);
        };
    
        handleRedirect();
    }, [user, guestId, cart?.products?.length, redirect, dispatch, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
       dispatch(loginUser({email,password}));
        
    };

  return (
    <div className='flex'>
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
            <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
                <div className='flex justify-center mb-6'>
                    <h2 className='text-xl font-medium '>SHOPY</h2>
                </div>
                <h2 className='text-2xl font-bold text-center mb-6'>Happy To See You</h2>
                <p className='text-center mb-6'>
                    Enter your username and password to Login.
                </p>
                <div className='mb-4'>
                    <label className='block text-sm font-semibold mb-2 '>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className='w-full p-2 border rounded' placeholder='Enter your email address' />
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-semibold mb-2 '>Password</label>
                    <input type="password" value={password} onChange={(e) => setPasword(e.target.value)} className='w-full p-2 border rounded' placeholder='Enter your Password' />
                </div>
                <button type='submit' className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800'>
                    {loading ? "loading..." : "Sign In"}
                </button>
                <p className='mt-6 text-center text-sm'>
                    Don't have an account?{" "}
                    <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-800'>
                        Register
                    </Link>
                </p>
            </form>
        </div>
        <div className='hidden md:block w-1/2 bg-gray-800'>
            <div className='h-full flex flex-col justify-center items-center'>
              <img src={login} alt="Login to an account" className='h-[576px] w-full object-cover' />  
            </div>    
        </div>
      
    </div>
  )
}

export default Login
