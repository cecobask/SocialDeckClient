<template>
  <form>
    <div class="container">
      <label for="username"><b>Username</b></label>
      <input type="text" placeholder="Enter Username" id="username" required>
      <br>
      <label for="password"><b>Password</b></label>
      <input type="password" placeholder="Enter Password" id="password" required>
      <br>
      <br>
      <button type="submit">Login</button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'Donations',
  data () {
    return {
      messageTitle: 'Login'
    }
  }
}
</script>

<style scoped>
  input[type=text], input[type=password] {
    width: 30%;
    padding: 12px 20px;
    margin: 8px;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  /* Set a style for all buttons */
  button {
    background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 20%;
    border-radius: 12px;
  }

  button:hover {
    opacity: 0.8;
  }

  .container {
    padding: 16px;
    border: 3px solid #f1f1f1;
  }

</style>
