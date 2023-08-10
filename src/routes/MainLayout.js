import { Grid } from '@mui/material/';
import makeStyles from '@mui/styles/makeStyles';
import { ErrorBoundary, ResponsiveAppBar } from '../components';

const TITLE_PUBLIC = 'Purebet Swipe: Highest odds, bet straight from your wallet';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh', // Full screen height
    paddingTop: 110, // on Small screen
    [theme.breakpoints.up('sm')]: {
      paddingTop: 110, // on Large screen
    },
  },
  header: {},
  sportsMenu: {
    [theme.breakpoints.down('hd')] : {
      minWidth: '100%'
    },
    [theme.breakpoints.up('md')] : {
      flex: "0 0 auto"
    },
  },
  betSlipColumn: {
    flex: "1 1 20%",
    minWidth: "280px",
    maxWidth: "425px",
    [theme.breakpoints.down('hp')] : {
      flex: "1 1 15%",
      maxWidth: '-webkit-fill-available'
    },
  },
  toolbar: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  title: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    flexGrow: 1,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  content: {
    flexGrow: 1, // Takes all possible space
    padding: theme.spacing(1),
  },
  footer: {},
}));


const MainLayout = ({ children }) => {
  const classes = useStyles();

  const title = TITLE_PUBLIC;
  document.title = title; // Also Update Tab Title

  return (
    <>
      <Grid container direction="column" className={classes.root}>
        <Grid item className={classes.header} component="header">
          <ResponsiveAppBar />
        </Grid>

        <Grid item className={classes.content} component="main">
          <ErrorBoundary name="Content">

            <div class="swipe-app-container">
              <div>{children}</div>
            </div>

          </ErrorBoundary>
        </Grid>
      </Grid>
    </>
  );
};

export default MainLayout;
