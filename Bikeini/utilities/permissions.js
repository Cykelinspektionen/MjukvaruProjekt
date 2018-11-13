import { Permissions } from 'expo';

const permissions = {

  async cameraPermission() {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
    } catch (error) {
      console.log(`Permission Error: ${error.message}`);
    }
  },

  async cameraRollPermission() {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ hasCameraRollPermission: status === 'granted' });
    } catch (error) {
      console.log(`Permission Error: ${error.message}`);
    }
  },
};

export default permissions;
