import { graph, type Node } from "@/lib/schema";

/**
 * 페이지당 한 번만 렌더링하세요.
 * 여러 <script type="application/ld+json"> 을 흩뿌리는 것보다
 * @graph 하나에 모아 @id 로 연결하는 편이 엔티티 해석에 유리해요.
 */
export default function JsonLd({ nodes }: { nodes: Node[] }) {
  return (
    <script
      type="application/ld+json"
      // 구조화 데이터는 신뢰된 서버 값만 담습니다.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph(nodes)).replace(/</g, "\\u003c"),
      }}
    />
  );
}
