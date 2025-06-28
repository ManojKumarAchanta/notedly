import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://notedly-4ml6.onrender.com/api/note",
    baseUrl: "http://localhost:8000/api/note",
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      // Don't set Content-Type for FormData endpoints - let browser set it with boundary
      const formDataEndpoints = ["createNote", "updateNote", "addAttachments"];
      if (!formDataEndpoints.includes(endpoint)) {
        headers.set("Content-Type", "application/json");
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
      query: (noteData) => {
        // If noteData is FormData (has files), send as is
        if (noteData instanceof FormData) {
          return {
            url: "/create",
            method: "POST",
            body: noteData,
          };
        }
        // Otherwise, send as JSON
        return {
          url: "/create",
          method: "POST",
          body: noteData,
        };
      },
      invalidatesTags: ["Note"],
    }),

    updateNote: builder.mutation({
      query: ({ id, ...noteData }) => {
        // Check if noteData is FormData or contains files
        if (noteData instanceof FormData) {
          return {
            url: `/update/${id}`,
            method: "PUT",
            body: noteData,
          };
        }
        // Otherwise, send as JSON
        return {
          url: `/update/${id}`,
          method: "PUT",
          body: noteData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Note", id },
        "Note",
      ],
    }),

    // New attachment-specific endpoints
    addAttachments: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}/attachments`,
        method: "POST",
        body: formData, // FormData with files
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Note", id },
        "Note",
      ],
    }),

    removeAttachment: builder.mutation({
      query: ({ noteId, attachmentIndex }) => ({
        url: `/${noteId}/attachments/${attachmentIndex}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { noteId }) => [
        { type: "Note", id: noteId },
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

    enhanceNoteWithAI: builder.mutation({
      query: (note) => ({
        url: "/enhance",
        method: "POST",
        body: note,
      }),
      invalidatesTags: ["Note"],
    }),
  }),
});

export const {
  useEnhanceNoteWithAIMutation,
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
  // New attachment hooks
  useAddAttachmentsMutation,
  useRemoveAttachmentMutation,
} = notesApi;
