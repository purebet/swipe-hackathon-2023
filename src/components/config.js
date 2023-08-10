/**
 * AppAlert and AppSnackBarAlert components
 */
export const APP_ALERT_SEVERITY = 'error'; // 'error' | 'info'| 'success' | 'warning'
export const APP_ALERT_VARIANT = 'filled'; // 'filled' | 'outlined' | 'standard'

/**
 * AppButton component
 */
export const APP_BUTTON_VARIANT = 'contained'; // | 'text' | 'outlined'
export const APP_BUTTON_MARGIN = 1;
export const APP_SPORT_MARGIN = 2;

/**
 * AppLink component
 */
export const APP_LINK_COLOR = 'textSecondary'; // 'primary' // 'secondary'
export const APP_LINK_UNDERLINE = 'hover'; // 'always

/**
 * AppSection component
 */
export const APP_SECTION_VARIANT = 'h6'; // 'subtitle1' | 'body1' | 'h6'

/**
 * AppSnackBar and AppSnackBarProvider components
 */
export const APP_SNACKBAR_MAX_COUNT = 5; // Used in AppSnackBarProvider from notistack npm
export const APP_SNACKBAR_AUTO_HIDE_DURATION = 3000; // Set to null if want to disable AutoHide feature
export const APP_SNACKBAR_ANCHOR_ORIGIN_VERTICAL = 'bottom'; // 'bottom | 'top'
export const APP_SNACKBAR_ANCHOR_ORIGIN_HORIZONTAL = 'center'; // 'center' | 'left' | 'right'

export const SPORTS = [
    { title: 'Soccer', link: '/sports/soccer', logo: '/img/sports/soccer.png', slug: 'soccer' },
    { title: 'American Football', link: '/sports/americanfootball', logo: '/img/sports/americanfootball.png', slug: 'americanfootball' },
    { title: 'Baseball', link: '/sports/baseball', logo: '/img/sports/baseball.png', slug: 'baseball' },
    { title: 'Basketball', link: '/sports/basketball', logo: '/img/sports/basketball.png', slug: 'basketball' },
    { title: 'Ice Hockey', link: '/sports/hockey', logo: '/img/sports/hockey.png', slug: 'hockey' },
    { title: 'Tennis', link: '/sports/tennis', logo: '/img/sports/tennis.png', slug: 'tennis' },
    { title: 'Cricket', link: '/sports/cricket', logo: '/img/sports/cricket.png', slug: 'cricket' },
    { title: 'Esports', link: '/sports/esports', logo: '/img/sports/esports.png', slug: 'esports' },
    { title: 'Combat Sports', link: '/sports/combat', logo: '/img/sports/combat.png', slug: 'combat' },
    { title: 'Cryptocurrency', link: '/sports/cryptocurrency', logo: '/img/sports/cryptocurrency.png', slug: 'cryptocurrency' },
    { title: 'Politics', link: '/sports/politics', logo: '/img/sports/politics.png', slug: 'politics' },
]; 
