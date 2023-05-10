import LogoTransparent from "~/assets/i7r-colosseum-logo-ic-transparent.png";
import GitHubIcon from "~/assets/icon/github";
import { signInWithGithub } from "~/features/auth"

const SignIn = () => {
  return (
    <div class="flex flex-col items-center gap-2">
      <img src={LogoTransparent} alt="Logo" class="w-96" />
      <h1 class="text-4xl text-slate-300 font-bold font-mono">Colosseum</h1>
      <button
        type="button"
        class="flex justify-center items-center w-10 h-10 mt-8 bg-slate-300 hover:bg-slate-400 active:scale-95 transition-all duration-300 rounded-full"
        onClick={signInWithGithub}
      >
        <GitHubIcon class="w-8 h-8" />
      </button>
    </div>
  )
}

export default SignIn
