import Link from 'next/link';

export default function Home() {
    return (
        <>
            <Link id={'basic-test'} href={'/basic-test'}>
                Basic Test
            </Link>
        </>
    );
}
