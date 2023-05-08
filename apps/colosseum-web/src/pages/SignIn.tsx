import { signInWithGithub } from "~/features/auth"

const SignIn = () => {
  return (
    <button type="button" class="btn btn-primary" onClick={signInWithGithub}>
      Sign in with GitHub
    </button>
  )
}

export default SignIn
