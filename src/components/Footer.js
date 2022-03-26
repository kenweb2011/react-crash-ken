import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer>
            <p>Copyright &copy; 2022</p>
            <Link to='/about'>About</Link>
            {/* <a href="/about"></a> */}
        </footer>
    )
}

export default Footer
