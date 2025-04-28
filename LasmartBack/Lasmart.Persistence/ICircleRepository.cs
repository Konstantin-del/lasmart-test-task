

using Lasmark.Persistence.Entitys;

namespace Lasmark.Persistence;

public interface ICircleRepository
{
    public Task CreateCircleAsync(CircleEntity circle);

    public Task<List<CircleEntity>> GetCirclesAsync();

    public Task AddCommentAsync(CommentEntity comment);

    public Task DeleteCercleAsync(int id);
}
