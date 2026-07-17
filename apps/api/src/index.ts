import {createApp} from './app';

const port = Number(process.env.PORT || 4200);
const app = createApp();

app.listen(port, () => {
  console.log(`ClientOps Studio running at http://localhost:${port}`);
});
