type Props = React.SVGAttributes<SVGElement>;

export function ArrowForward(props: Props) {
  return (
    <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
    </svg>
  );
}
