import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Image from 'next/image';
import Link from 'next/link';
import styles from './episode.module.scss'
import { usePlayer } from '../../contexts/PlayerContext';
import Head from 'next/head'


type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
}

type EpisodeProps = {
    episode: Episode
}



export default function Episode({ episode }: EpisodeProps) {

    const { play } = usePlayer();

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title}</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>

                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover" />

                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episodio" />
                </button>
            </div>

            <header>
                <h1>
                    {episode.title}
                </h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }} />

        </div>
    )
}


export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {
                params: {
                    // Voce passa aqui o valor da página que voce quer gerar de maneira estatica
                    slug: 'a-importancia-da-contribuicao-em-open-source'
                }
            }
        ],
        fallback: 'blocking'
    }
}



export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;

    const { data } = await api.get(`/episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    };

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24, // 24 hours
    }
}

function usePlay(): {} {
    throw new Error('Function not implemented.');
}
