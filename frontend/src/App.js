import { BrowserRouter as Router, Route } from 'react-router-dom';

//page
import './App.css';
import Main from './pages/Main';
import Fridge from './pages/Fridge';
import Recipe from './pages/Recipe';
import RecipeDetail from './pages/RecipeDetail';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import ChangePassword from './components/Auth/ChangePassword';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import DeleteUser from './pages/Profile/DeleteUser';
import ChangeUserDetail from './pages/Profile/ChangeUserDetail';
import CheckPassword from './pages/Profile/CheckPassword';

// Theme & Style
import { ThemeProvider } from '@material-ui/core/styles';
import createTheme from '@material-ui/core/styles/createTheme';


const mytheme = createTheme({
    palette: {
        primary: {
            light: '#f2da9e',
            main: '#f9bc15',
            dark: '#f19920',
            contrastText: '#fff',
        },
        secondary: {
            light: '#f2ede7',
            main: '#a29d97',
            dark: '#45423c',
            contrastText: '#fff',
        },
        success: {
            light: '#f2ede7',
            main: '#fee500',
            dark: '#45423c',
            contrastText: '#191600',
        },
        
    },
    typography: {
        fontFamily: "'KoPubWorld', Munhwajae, jeju",
        fontStyle: "normal",
        fontWeight: "Bold"
    },
});


function App() {
  return (
    <div className="App">
      <ThemeProvider theme={mytheme}>
        <Router>
          <Route exact path='/' component={Main} />
          <Route path='/fridge' component={Fridge} />
          <Route path='/recipe' component={Recipe} />
          <Route path="/rec/:rid" component={RecipeDetail} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/changepassword" component={ChangePassword} />
          <Route path="/profile" component={Profile} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/usr/check/:id" component={CheckPassword} />
          <Route path="/usr/update" component={ChangeUserDetail} />
          <Route path="/usr/delete" component={DeleteUser} />
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;