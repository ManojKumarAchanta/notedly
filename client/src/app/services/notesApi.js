import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://notedly-4ml6.onrender.com/api/note",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Note"], // Add cache tags for invalidation
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "/notes",
      providesTags: ["Note"],
    }),

    // These should be mutations, not queries
    togglePin: builder.mutation({
      query: (id) => ({
        url: `/togglepin/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Note"],
    }),

    toggleArchive: builder.mutation({
      query: (id) => ({
        url: `/togglearchive/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Note"],
    }),

    getPinnedNotes: builder.query({
      query: (id) => `/getpinned/${id}`,
      providesTags: ["Note"],
    }),

    getArchives: builder.query({
      query: (id) => `/getarchives/${id}`,
      providesTags: ["Note"],
    }),

    getNote: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Note", id }],
    }),

    createNote: builder.mutation({
      query: (note) => ({
        url: "/create",
        method: "POST",
        body: note,
      }),
      invalidatesTags: ["Note"],
    }),

    updateNote: builder.mutation({
      query: ({ id, ...note }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: note,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Note", id },
        "Note",
      ],
    }),

    deleteNote: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Note", id }, "Note"],
    }),

    deleteManyNotes: builder.mutation({
      query: (noteIds) => ({
        url: "/delete",
        method: "DELETE",
        body: { noteIds },
      }),
      invalidatesTags: ["Note"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useCreateNoteMutation,
  useGetNoteQuery,
  useGetPinnedNotesQuery,
  useToggleArchiveMutation, // Changed from Query to Mutation
  useTogglePinMutation, // Changed from Query to Mutation
  useGetArchivesQuery,
  useDeleteManyNotesMutation,
} = notesApi;
