import Image from 'next/image'
import appPreviewImg from '../assets/app-copa-preview.png'
import logo from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("")
  const [poolCode, setPoolCode] = useState("")

  async function createPool(event: FormEvent) {
    event.preventDefault()
    if (poolTitle) {
      try {
        const response = await api.post('/pools', {
          title: poolTitle
        })

        const {code} = response.data

        setPoolCode(code)

        await navigator.clipboard.writeText(code)

        setPoolTitle("")
      }
      catch(error) {
        console.log("error", error)
        alert("Falha ao criar o bolão, tente novamente!")
      }
    }
  }
  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image 
          src={logo}
          alt="Bolao do Copa logo"
        />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt="users avatar example" />

          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
          />
          <button
          className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        {
          poolCode && <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
            <span className='font-bold text-2xl text-ignite-500'>{poolCode}</span> Este é o seu código, compartilhe com seus amigos. Ele já foi copiado para a sua área de transferência!
          </p>
            
        }
        {
          !poolCode && <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
            Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
          </p>
        }

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-stretch justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px items-center bg-gray-600'/>

          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      
      <Image 
        src={appPreviewImg} 
        alt="Two mobile devices displaying the Bolao Copa mobile app preview"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [
      poolCountResponse,
      guessCountResponse,
      usersCountResponse
    ] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: usersCountResponse.data.count
    }
  }
}