import app from './app';
import {PORT} from './config';


app.listen(PORT, () => {
console.log(`legacybridge integration service listening on ${PORT}`);
});