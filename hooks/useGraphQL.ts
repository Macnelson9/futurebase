import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

const query = gql`
  {
    stats(first: 5) {
      id
      totalActiveUsers
    }
    users(first: 5) {
      id
      memoriesCount
      createdAt
    }
  }
`;

const url =
  "https://api.studio.thegraph.com/query/120551/future-base/version/latest";
const headers = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}`,
};

export function useGraphQLStats() {
  return useQuery({
    queryKey: ["graphql-stats"],
    queryFn: async () => {
      return await request(url, query, {}, headers);
    },
  });
}
