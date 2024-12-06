// server.ts
import { app, port } from './app';  // Import app and port from app.ts

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
